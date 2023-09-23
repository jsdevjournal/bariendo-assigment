
export default function Component({ children, className, ...props }) {
  return (
    <button
      className={`bg-blue-500 ${className} w-80 min-w-80 text-white font-bold mt-10 py-4 px-4 rounded-full sm:max-w-xl sm:mx-auto`}
      {...props}
    >
      {children}
    </button>
  )
}
