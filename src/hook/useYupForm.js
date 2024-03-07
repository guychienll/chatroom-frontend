import { Chip } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md";

export const useYupForm = (initialValues, schema) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState([]);

    const onValueChange = useCallback(
        (name) => (value) => {
            try {
                setValues((prev) => {
                    return {
                        ...prev,
                        [name]: value,
                    };
                });
            } catch (e) {
                alert(e.message);
            }
        },
        [],
    );

    useEffect(() => {
        (async () => {
            try {
                const _values = await schema.validate(values, {
                    abortEarly: false,
                });
                if (_values) {
                    setErrors([]);
                }
            } catch (e) {
                setErrors(e.inner);
            }
        })();
    }, [schema, values]);

    const renderValidatorChips = (name) => {
        return (
            <div className="flex flex-wrap py-2">
                {schema.fields[name].tests.map((test) => {
                    const options = test.OPTIONS;
                    const isValid = !errors.some(
                        (err) => err.message === options.message,
                    );
                    return (
                        <Chip
                            color={isValid ? "success" : "danger"}
                            className="mr-1 text-white"
                            variant="solid"
                            startContent={
                                isValid ? (
                                    <MdCheckCircleOutline size={16} />
                                ) : (
                                    <MdErrorOutline size={16} />
                                )
                            }
                            key={options.message}
                        >
                            {options.message}
                        </Chip>
                    );
                })}
            </div>
        );
    };

    const getFiledValid = (name) => {
        return errors.filter((err) => err.path === name).length === 0;
    };

    return {
        isValid: errors.length === 0,
        values,
        onValueChange,
        renderValidatorChips,
        getFiledValid,
    };
};
