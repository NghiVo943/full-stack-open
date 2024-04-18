import React from 'react'
import '@testing-library/jest-dom'
import { within } from '@testing-library/dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog

beforeEach(() => {
    blog = {
        user: {
            name: 'Matti Luukkainen',
            username: 'mluukkai'
        },
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    }
})

test('renders blog\'s title and author, but not url and likes', () => {
    const container = render(<Blog blog={blog}/>).container

    const title = screen.queryByText('React patterns')
    expect(title).toBeDefined()
    const author = screen.queryByText('Michael Chan')
    expect(author).toBeDefined()

    const details = container.querySelector('.blog-details')
    expect(details).toHaveStyle('display: none')

    const url = within(details).queryByText('https://reactpatterns.com/')
    expect(url).toBeDefined()
    const likes = within(details).queryByText('7')
    expect(likes).toBeDefined()
})

test('renders blog\'s url and likes when button \'view\' clicked', async () => {
    const user = userEvent.setup()

    const container = render(<Blog blog={blog}/>).container
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const details = container.querySelector('.blog-details')
    expect(details).not.toHaveStyle('display: none')

    const url = within(details).queryByText('https://reactpatterns.com/')
    expect(url).toBeDefined()
    const likes = within(details).queryByText('7')
    expect(likes).toBeDefined()
})

test('calls inputted like function twice if \'like\' button clicked twice', async () => {
    const user = userEvent.setup()
    const likeFunction = jest.fn()

    const container = render(<Blog blog={blog} likeBlog={likeFunction}/>).container
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const details = container.querySelector('.blog-details')
    expect(details).not.toHaveStyle('display: none')

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeFunction.mock.calls).toHaveLength(2)
})