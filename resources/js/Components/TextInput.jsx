export default function TextInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    className = "",
    error = "",
    required = false,
    isDisabled
}){
    return(
        <div className="flex flex-col gap-y-1">
            <label htmlFor={name} className="font-semibold">{label}{ required && (<span className="text-red-500">*</span>)}</label>

            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                placeholder={placeholder}
                onChange={onChange}
                disabled={isDisabled}
                className={`w-50 rounded-md px-2 py-1
                    ${isDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
                    ${error ? "border border-red-500" : isDisabled ? "border border-gray-300" : "border border-gray-500"}
                    ${className}`}
            />

            {error && (
                <span className="text-red-500 text-sm mt-1">
                    {error}
                </span>
            )}
        </div>
    )
}