import React from 'react';
import { useSocketNotifications } from '~/pages/Notifi/socketcontext';
import moment from 'moment';
import Avatar from '~/components/partial/Avatar/avatar.component';

const NotificationDropdown = ({ type }) => {
    const { notifications, markNotificationAsRead } = useSocketNotifications();

    console.log(notifications);

    return (
        <div className="space-y-4">
            {
                type === 'all' ? (<>
                    { notifications.map(notification => (
                        <div
                            key={ notification._id }
                            className={ `p-4 border-b last:border-b-0 hover:shadow-2xl transition-colors cursor-pointer rounded-lg ${ notification.isRead ? '' : 'font-bold' }` }
                            onClick={ () => markNotificationAsRead(notification._id) }
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-3">
                                                <Avatar username={ notification.sender.username } width={ 30 }
                                                        height={ 30 } />
                                                <div>
                                                    <p className="text-sm">
                                                        { notification.content }
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">{ moment(notification.CreatedAt).fromNow() }</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) }
                </>) : type === 'comment' ? (<>
                    { notifications.filter(notification => notification.type === 'COMMENT').map(notification => (
                        <div
                            key={ notification._id }
                            className={ `p-4 border-b last:border-b-0 hover:shadow-2xl transition-colors cursor-pointer rounded-lg ${ notification.isRead ? '' : 'font-bold' }` }
                            onClick={ () => markNotificationAsRead(notification._id) }
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-3">
                                                <Avatar username={ notification.sender.username } width={ 30 }
                                                        height={ 30 } />
                                                <div>
                                                    <p className="text-sm">
                                                        {/*<span className="font-semibold">{ notification.user.name }</span>{ ' ' }*/ }
                                                        {/*{ notification.content }*/ }
                                                        {/*{ notification.article && (*/ }
                                                        {/*    <span className="font-medium ml-1">"{ notification.article }"</span>*/ }
                                                        {/*) }*/ }
                                                        { notification.content }
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">{ moment(notification.CreatedAt).fromNow() }</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) }
                </>) : ''
            }
        </div>
    )
        ;
};

export default NotificationDropdown;