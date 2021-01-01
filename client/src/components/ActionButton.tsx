interface Button {
  children: React.ReactNode;
}

const ActionButton: React.FC<Button> = ({ children }) => {
  return (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
};

export default ActionButton;