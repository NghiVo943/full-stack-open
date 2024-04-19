const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: "hellas",
        name: "Arto Hellas",
        password: "hellas321"
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'somethingwrong')
      await expect(page.getByText('Wrong credentials')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
  
    test('a new blog can be created', async ({ page }) => {
      const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/"
      }
      await createBlog(page, blog.title, blog.author, blog.url)
      await expect(page.getByText('React patterns Michael Chan')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        const initialBlogs = [
          {
              title: "React patterns",
              author: "Michael Chan",
              url: "https://reactpatterns.com/",
          },
          {
              title: "Go To Statement Considered Harmful",
              author: "Edsger W. Dijkstra",
              url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          },
          {
              title: "Canonical string reduction",
              author: "Edsger W. Dijkstra",
              url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          },
        ]
        await createBlog(page, initialBlogs[0].title, initialBlogs[0].author, initialBlogs[0].url)
        await createBlog(page, initialBlogs[1].title, initialBlogs[1].author, initialBlogs[1].url)
        await createBlog(page, initialBlogs[2].title, initialBlogs[2].author, initialBlogs[2].url)
      })
  
      test('number of likes can be changed', async ({ page }) => {
        await page.pause()
        const otherBlogElement = page.getByText('React patterns Michael Chan')
        await otherBlogElement.getByRole('button', { name: 'view' }).click()

        await expect(otherBlogElement.getByText('https://reactpatterns.com/')).toBeVisible()
        await expect(otherBlogElement.getByText('likes 0')).toBeVisible()

        await otherBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(otherBlogElement.getByText('likes 1')).toBeVisible()
      })

      test('blogs can be deleted', async ({ page }) => {
        await page.pause()
        page.on('dialog', async dialog => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain('Remove')
          await dialog.accept()
        })
        const otherBlogElement = page.getByText('React patterns Michael Chan')
        await otherBlogElement.getByRole('button', { name: 'view' }).click()

        await expect(otherBlogElement.getByText('Matti Luukkainen')).toBeVisible()
        await otherBlogElement.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('React patterns Michael Chan')).not.toBeVisible()
      })

      test('only the user who added the blog sees the blog\'s delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'hellas', 'hellas321')

        const otherBlogElement = page.getByText('React patterns Michael Chan')
        await otherBlogElement.getByRole('button', { name: 'view' }).click()

        await expect(otherBlogElement.getByText('Matti Luukkainen')).toBeVisible()
        await expect(otherBlogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are ordered by the number of likes', async ({ page }) => {
        let blogElements = await page.getByTestId('blog').all()
        await expect(blogElements[0].getByText('React patterns Michael Chan')).toBeVisible()
        await expect(blogElements[1].getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')).toBeVisible()
        await expect(blogElements[2].getByText('Canonical string reduction Edsger W. Dijkstra')).toBeVisible()

  
        await likeBlog(page, 'Go To Statement Considered Harmful', 'Edsger W. Dijkstra', true)
        await expect(page.getByText('Go To Statement Considered Harmful Edsger W. Dijkstra').getByText('likes 1')).toBeVisible()

        blogElements = await page.getByTestId('blog').all()
        await expect(blogElements[1].getByText('React patterns Michael Chan')).toBeVisible()
        await expect(blogElements[0].getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')).toBeVisible()
        await expect(blogElements[2].getByText('Canonical string reduction Edsger W. Dijkstra')).toBeVisible()


        await likeBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', true)
        await expect(page.getByText('Canonical string reduction Edsger W. Dijkstra').getByText('likes 1')).toBeVisible()
        await likeBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', false)
        await expect(page.getByText('Canonical string reduction Edsger W. Dijkstra').getByText('likes 2')).toBeVisible()

        blogElements = await page.getByTestId('blog').all()
        await expect(blogElements[2].getByText('React patterns Michael Chan')).toBeVisible()
        await expect(blogElements[1].getByText('Go To Statement Considered Harmful Edsger W. Dijkstra')).toBeVisible()
        await expect(blogElements[0].getByText('Canonical string reduction Edsger W. Dijkstra')).toBeVisible()
      })
    })
  })
})