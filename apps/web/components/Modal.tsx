import ReactDOM from "react-dom";

type ModalProps = {
  component: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ component, onClose }: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">{component}</div>
      </div>
    </div>,
    document.body
  );
}
