const Notification = ({ message, type }) => {
  if (type === 'error') {
    return (
      <div className="error">{message}</div>
    )
  }
  if (type === 'noti') {
    return (
      <div className="noti">
        {message}
      </div>  
    )
  }
}

export default Notification