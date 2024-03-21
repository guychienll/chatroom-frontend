import * as fileApi from "@/api/File";
import * as userApi from "@/api/User";
import { ProfileEditFormSchema } from "@/helper/validate";
import { useYupForm } from "@/hook/useYupForm";
import useUserStore from "@/stores/user";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useIntl } from "react-intl";

ProfileEditor.propTypes = {};

function ProfileEditor() {
    const { profile, setProfile } = useUserStore((state) => state);
    const router = useRouter();
    const intl = useIntl();
    const t = intl.messages[router.locale];
    const { values, isValid, onValueChange, renderValidatorChips } = useYupForm(
        {
            nickname: profile.nickname || "",
            gender: profile.gender || "other",
            birthday: profile.birthday || "2000-01-01",
            bio: profile.bio || "",
            avatar: profile.avatar || "",
        },
        ProfileEditFormSchema,
    );
    const [isLoading, setIsLoading] = useState(false);

    const uploadAvatar = async (e) => {
        try {
            setIsLoading(true);
            const file = e.target.files[0];
            const url = await fileApi.upload(file, {
                filename: profile.username.split("@")[0],
                pathname: "avatars/",
            });
            const result = await userApi.update({
                ...values,
                avatar: url,
            });

            setProfile({ ...profile, ...result });
            onValueChange("avatar")(result.avatar);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!isValid) {
                return;
            }
            setIsLoading(true);
            const result = await userApi.update(values);
            setProfile({
                ...profile,
                ...result,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-[280px]">
            <CardHeader className="flex flex-col items-center">
                <input
                    hidden
                    id="avatar-upload"
                    type="file"
                    onInput={uploadAvatar}
                />
                <Avatar
                    isBordered
                    src={values.avatar}
                    className="h-[100px] w-[100px] cursor-pointer text-large"
                    as="label"
                    htmlFor="avatar-upload"
                />
            </CardHeader>
            <CardBody className="flex flex-col items-start gap-y-2">
                <Input
                    name="nickname"
                    label={t["nickname"]}
                    value={values.nickname}
                    onValueChange={onValueChange("nickname")}
                    placeholder={t["nickname_placeholder"]}
                    type="text"
                    autoComplete="nickname"
                />
                <Select
                    name="gender"
                    selectedKeys={[values.gender]}
                    label={t["gender"]}
                    placeholder={t["gender_placeholder"]}
                    className="max-w-xs opacity-100 disabled:bg-[#E4E4E7]"
                    onChange={(e) => {
                        const { value } = e.target;
                        onValueChange("gender")(value);
                    }}
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
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </Select>
                {renderValidatorChips("gender")}
                <Input
                    name="birthday"
                    value={values.birthday}
                    label={t["birthday"]}
                    placeholder={t["birthday_placeholder"]}
                    type="date"
                    onValueChange={onValueChange("birthday")}
                />

                <Textarea
                    name="bio"
                    label={t["bio"]}
                    placeholder={t["bio_placeholder"]}
                    type="text"
                    value={values.bio}
                    onValueChange={onValueChange("bio")}
                />
                {renderValidatorChips("bio")}
            </CardBody>
            <CardFooter>
                <Button
                    isLoading={isLoading}
                    className="w-full"
                    color="danger"
                    onPress={handleSubmit}
                >
                    {t["save_button"]}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProfileEditor;
