export default function TextInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    className = "",
    error = "",
}){
    return(
        <div className="flex flex-col">
            <label htmlFor={name}>{label}</label>

            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ""}
                placeholder={placeholder}
                onChange={onChange}
                className={`w-50 rounded-md px-2 py-1 bg-[#F5F5F5]
                    ${error ? "border border-red-500" : "border"}
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