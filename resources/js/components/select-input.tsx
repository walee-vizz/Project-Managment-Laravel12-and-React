import { forwardRef, useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue, PropsValue } from 'react-select';
import { SelectInputOption, SelectInputProps } from '@/types';

const SelectInput = forwardRef<Select, SelectInputProps>(
    ({ className = '', options, isMulti = false, defaultValue, onChange, ...props }, ref) => {
        // const localRef = useRef<Select>(null);
        const [selectedOption, setSelectedOption] = useState<PropsValue<SelectInputOption>>(defaultValue ?? (isMulti ? [] : null));
        console.log('sdad', ref);
        useEffect(() => {
            if (defaultValue !== undefined) {
                if (isMulti && Array.isArray(defaultValue)) {
                    const defaultOptions = options.filter(option =>
                        defaultValue.includes(option.value as never)
                    );
                    setSelectedOption(defaultOptions);
                } else if (!isMulti) {
                    const defaultOption = options.find(option => option.value === (defaultValue as SelectInputOption)?.value);
                    setSelectedOption(defaultOption || null);
                }
            }
        }, [defaultValue, options, isMulti]);

        // Type the option parameter
        const handleChange = (
            option: SingleValue<SelectInputOption> | MultiValue<SelectInputOption>
        ) => {
            setSelectedOption(option as SelectInputOption | SelectInputOption[] | null);
            if (onChange) {
                onChange(option as SelectInputOption | SelectInputOption[] | null);
            }
        };

        return (
            <Select
                {...props}
                options={options}
                isMulti={isMulti}
                classNamePrefix="react-select"
                value={selectedOption} // Controlled component with selectedOption state
                onChange={handleChange}
                className={`react-select-container ${className}`}
            // ref={ref || localRef} // Use the forwarded ref or fallback to localRef
            />
        );
    });

export default SelectInput;
