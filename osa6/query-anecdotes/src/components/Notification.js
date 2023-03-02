const Notification = () => {
  const notification = null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const handleClick = () => {
  }

  if (notification === null) {
    return null
  }
  
  return (
    <div style={style} onClick={handleClick}>
      {notification}
    </div>
  )
}

export default Notification
