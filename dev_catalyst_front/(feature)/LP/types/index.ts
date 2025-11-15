import { CSSProperties, ReactNode } from "react";

export type LpSectionHeaderAlign = "left" | "center";

export interface LpSectionHeaderProps {
    label?: string;
    title: ReactNode;
    description?: ReactNode;
    align?: LpSectionHeaderAlign;
    className?: string;
    labelClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    isVisible?: boolean;
    transitionDelay?: number;
}

export interface LpInfoCardProps {
    icon?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
    iconWrapperClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    style?: CSSProperties;
}

export interface LpSectionProps {
    id?: string;
    children: ReactNode;
    className?: string;
    containerClassName?: string;
}




