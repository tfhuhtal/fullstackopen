const reducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
        return action.notification
        default:
        return state
    }
}

export const setNotification = (notification, time) => {
    return async dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            notification
        })
        setTimeout(() => {
            dispatch({
                type: 'SET_NOTIFICATION',
                notification: null
            })
        }, time * 1000)
    }
}

export default reducer
