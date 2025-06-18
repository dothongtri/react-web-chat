type Props = {
    message: string;
};

const MyMessage = ({ message }: Props) => {
    return (
        <div className="flex justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
                <div className="text-sm text-right">{message}</div>
            </div>
        </div>
    );
};

export default MyMessage;
