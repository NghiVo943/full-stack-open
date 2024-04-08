const Notification = ({ message }) => {
  if (!message) {
    return
  }

  if (message.type === 'error') {
    return (
      <div className="error">{message.message}</div>
    )
  }
  if (message.type === 'noti') {
    return (
      <div className="noti">
        {message.message}
      </div>
    )
  }
}

export default Notification