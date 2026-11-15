import type { ReactNode, Ref } from "react";
import type { ImageSourcePropType, TextInputInstance, TextInputProps } from "react-native";

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Subscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
        billing: string;
        renewalDate?: string;
        color?: string;
    }

    interface SubscriptionCardProps extends Omit<Subscription, "id"> {
        expanded: boolean;
        onPress: () => void;
        onCancelPress?: () => void;
        isCancelling?: boolean;
    }

    interface UpcomingSubscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        price: number;
        currency?: string;
        daysLeft: number;
    }

    interface UpcomingSubscriptionCardProps
        extends Omit<UpcomingSubscription, "id"> {}

    interface ListHeadingProps {
        title: string;
    }

    type AuthErrorField = "email" | "password" | "code" | "form";

    type AuthFormErrors = Partial<Record<AuthErrorField, string>>;

    interface PasswordRule {
        id: string;
        label: string;
        test: (value: string) => boolean;
    }

    interface AuthScreenProps {
        children: ReactNode;
    }

    interface AuthBrandProps {
        title: string;
        subtitle: string;
    }

    interface AuthFieldProps extends TextInputProps {
        label: string;
        error?: string;
        helper?: string;
        secureToggle?: boolean;
        ref?: Ref<TextInputInstance>;
    }

    interface AuthButtonProps {
        title: string;
        onPress: () => void;
        loading?: boolean;
        disabled?: boolean;
        variant?: "primary" | "secondary";
    }

    interface AuthBannerProps {
        message: string;
    }

    interface PasswordRulesProps {
        value: string;
    }

    interface AuthCodeStepProps {
        email: string;
        code: string;
        onChangeCode: (code: string) => void;
        error?: string;
        onSubmit: () => void;
        submitting: boolean;
        onResend: () => void;
        resending: boolean;
        resendIn: number;
        onBack: () => void;
        backLabel: string;
        disabled?: boolean;
    }
}

export {};