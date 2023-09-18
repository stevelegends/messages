import { msg } from "@lingui/macro";

const errorMessage = {
    "auth/email-already-in-use": msg`This email already in use`,
    "auth/invalid-login-credentials": msg`Invalid login credentials`,
    "auth/too-many-requests": msg`Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.`,
    default: msg`Something went wrong.`
};

export default errorMessage;
