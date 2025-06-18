type Props = {
    message: string;
    name: string;
    avatarUrl?: string; // Thêm đường dẫn ảnh avatar
};

const OtherMessage = ({ message, name, avatarUrl }: Props) => {
    return (
        <div className="flex items-start gap-2 max-w-md">
            <img
                src={avatarUrl || "/default-avatar.png"}
                alt={name}
                className="w-8 h-8 rounded-full object-cover"
            />
            <div className="inline-block bg-white/80 backdrop-blur-md px-4 py-2 rounded-lg max-w-xs break-words">
                <div className="text-sm font-semibold text-left text-gray-800">
                    {name}
                </div>
                <div className="text-sm text-gray-900 text-left">{message}</div>
            </div>
        </div>
    );
};

export default OtherMessage;
