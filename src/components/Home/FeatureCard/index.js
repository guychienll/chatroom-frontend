import { Card, CardBody, CardHeader } from "@nextui-org/react";
import PropTypes from "prop-types";

FeatureCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
};

function FeatureCard({ title, description, icon }) {
    return (
        <Card className="w-[240px] gap-y-4 py-4">
            <CardHeader className="flex-col items-center gap-y-4 px-4 pb-0 pt-2">
                <h4 className="text-2xl font-bold text-danger">{title}</h4>
                <small className="whitespace-pre-line text-default-500">
                    {description}
                </small>
            </CardHeader>
            <CardBody className="flex flex-col items-center py-2">
                {icon}
            </CardBody>
        </Card>
    );
}
export default FeatureCard;
