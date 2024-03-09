import * as userApi from "@/api/User";
import useUserStore from "@/stores/user";
import {
    Avatar,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

ProfileEditor.propTypes = {
    username: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    isReadOnly: PropTypes.bool,
};

function ProfileEditor(props) {
    const { username, isOpen, onOpenChange, uploadFile, isReadOnly } = props;
    const { profile, setProfile } = useUserStore((state) => state);
    const [values, setValues] = useState({
        avatar: "",
        nickname: "",
        birthday: "2000-01-01",
        gender: "",
        bio: "",
    });
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];

    useEffect(() => {
        try {
            const init = async () => {
                const resp = await userApi.getUser({
                    username,
                });
                setValues({
                    avatar: resp.avatar,
                    nickname: resp.nickname,
                    birthday: resp.birthday,
                    gender: resp.gender,
                    bio: resp.bio,
                });
            };
            init();
        } catch (e) {
            console.error(e);
        }
    }, [username]);

    const handleUpdateAvatar = async (e) => {
        const url = await uploadFile(e, profile.username.split("@")[0]);
        const resp = await userApi.update({
            nickname: profile.nickname || "",
            birthday: profile.birthday || "",
            gender: profile.gender || "",
            bio: profile.bio || "",
            avatar: url,
        });

        if (resp.avatar) {
            setProfile({
                ...profile,
                avatar: resp.avatar,
            });
            setValues((prev) => ({
                ...prev,
                avatar: resp.avatar,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const resp = await userApi.update(values);
        setProfile({
            ...profile,
            ...resp,
        });
        onOpenChange(false);
    };

    return (
        <Modal
            size="sm"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isKeyboardDismissDisabled={true}
            isDismissable
            hideCloseButton
            backdrop="blur"
        >
            <ModalContent className="max-w-[300px]">
                {() => {
                    return (
                        <>
                            <ModalHeader className="flex flex-col text-center">
                                <div className="text-2xl tracking-wide text-danger">
                                    {t["profile_editor_title"]}
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex flex-col items-center">
                                <input
                                    hidden
                                    id="avatar-upload"
                                    type="file"
                                    onInput={handleUpdateAvatar}
                                    disabled={isReadOnly}
                                />
                                <Avatar
                                    isBordered
                                    src={values.avatar}
                                    className="h-20 w-20 cursor-pointer text-large"
                                    as="label"
                                    htmlFor="avatar-upload"
                                />
                                <Input
                                    name="nickname"
                                    value={values.nickname}
                                    label={t["nickname"]}
                                    placeholder={t["nickname_placeholder"]}
                                    type="text"
                                    autoComplete="nickname"
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />
                                <Select
                                    name="gender"
                                    selectedKeys={[values.gender]}
                                    label={t["gender"]}
                                    placeholder={t["gender_placeholder"]}
                                    className="max-w-xs opacity-100 disabled:bg-[#E4E4E7]"
                                    onChange={handleChange}
                                    isDisabled={isReadOnly}
                                >
                                    {[
                                        {
                                            label: t["male"],
                                            value: "male",
                                        },
                                        {
                                            label: t["female"],
                                            value: "female",
                                        },
                                        {
                                            label: t["other"],
                                            value: "other",
                                        },
                                    ].map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    name="birthday"
                                    value={values.birthday}
                                    label={t["birthday"]}
                                    placeholder={t["birthday_placeholder"]}
                                    type="date"
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />

                                <Textarea
                                    name="bio"
                                    value={values.bio}
                                    label={t["bio"]}
                                    placeholder={t["bio_placeholder"]}
                                    type="text"
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                />
                            </ModalBody>
                            {!isReadOnly && (
                                <ModalFooter className="flex justify-center">
                                    <Button
                                        className="w-full"
                                        color="danger"
                                        onPress={handleSubmit}
                                    >
                                        {t["save_button"]}
                                    </Button>
                                </ModalFooter>
                            )}
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}

export default ProfileEditor;
