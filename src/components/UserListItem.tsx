import React from "react";

interface UserListItemResponse {
    userName?: string;
    avt?: string;
    id?: BigInteger;
    email?: string;
    onClick?: () => void;
}

const UserListItem = (userListItemResponse: UserListItemResponse) => {
    return (
        <div
            onClick={userListItemResponse.onClick}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
        >
            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white font-semibold">
                {userListItemResponse.avt}
            </div>
            <div className="flex-1">
                <div className="font-semibold">
                    {userListItemResponse.userName}
                </div>
                <div className="text-sm text-gray-500">
                    {"Last message preview..."}
                </div>
            </div>
            <div className="text-xs text-gray-400">{"7:15 PM"}</div>
        </div>
    );
};

export default UserListItem;
