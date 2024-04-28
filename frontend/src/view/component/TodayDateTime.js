import React, { useState, useEffect } from 'react'
import moment from 'moment';

export const TodayDateTime = () => {

    var [date, setDate] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }

    });

    return (
        <p>{moment().format('dddd MMMM Do YYYY, h:mm a')}</p>
    )
}

export default TodayDateTime