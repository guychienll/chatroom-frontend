import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { LOCALES } from "../constants";

export function LocaleSwitch() {
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button color="danger" variant="bordered">
                    {t["language_switch"]}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={LOCALES}>
                {(item) => (
                    <DropdownItem
                        locale={item.value}
                        key={item.key}
                        color="danger"
                        replace
                        href={router.pathname}
                        as={Link}
                    >
                        {item.label}
                    </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
    );
}
