import { useState } from "react";
import PropTypes from "prop-types";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Avatar,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
} from "@nextui-org/react";
import useUserStore from "@/stores/user";
import * as userApi from "@/api/User";

ProfileEditor.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
};

function ProfileEditor(props) {
    const { isOpen, onOpenChange, uploadFile } = props;
    const { profile, setProfile } = useUserStore((state) => state);
    const [values, setValues] = useState({
        avatar: profile.avatar || "",
        nickname: profile.nickname || "",
        birthday: profile.birthday || "2000-01-01",
        gender: profile.gender || "",
        bio: profile.bio || "",
    });

    const handleUpdateAvatar = async (e) => {
        const url = await uploadFile(e);
        const resp = await userApi.update({
            avatar: url,
        });
        if (resp.avatar) {
            setProfile({
                ...profile,
                avatar: resp.avatar,
            });
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

    console.log(values);

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
                {(onClose) => {
                    return (
                        <>
                            <ModalHeader className="flex flex-col text-center">
                                <div className="text-2xl italic tracking-wide text-danger">
                                    Profile
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex flex-col items-center">
                                <input
                                    hidden
                                    id="avatar-upload"
                                    type="file"
                                    onInput={handleUpdateAvatar}
                                />
                                <Avatar
                                    isBordered
                                    src={profile.avatar}
                                    className="h-20 w-20 cursor-pointer text-large"
                                    as="label"
                                    htmlFor="avatar-upload"
                                />

                                <Input
                                    name="nickname"
                                    value={values.nickname}
                                    label="暱稱"
                                    type="text"
                                    placeholder="請輸入暱稱"
                                    autoComplete="nickname"
                                    onChange={handleChange}
                                />
                                <Select
                                    name="gender"
                                    selectedKeys={[values.gender]}
                                    label="生理性別"
                                    placeholder="請選擇生理性別"
                                    className="max-w-xs"
                                    onChange={handleChange}
                                >
                                    {[
                                        {
                                            label: "男",
                                            value: "male",
                                        },
                                        {
                                            label: "女",
                                            value: "female",
                                        },
                                        {
                                            label: "其他",
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
                                    label="生日"
                                    type="date"
                                    placeholder="請選擇生日"
                                    onChange={handleChange}
                                />
                                <Textarea
                                    name="bio"
                                    value={values.bio}
                                    label="自我介紹"
                                    type="text"
                                    placeholder="請輸入自我介紹"
                                    onChange={handleChange}
                                />
                            </ModalBody>
                            <ModalFooter className="flex justify-center">
                                <Button color="danger" onPress={handleSubmit}>
                                    儲存
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}

export default ProfileEditor;
