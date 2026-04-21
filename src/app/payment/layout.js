export default function PaymentLayout({ children }) {
  return (
    <div className="fixed inset-0 z-[200] bg-gray-50 overflow-auto">
      {children}
    </div>
  );
}
