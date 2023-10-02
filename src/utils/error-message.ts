import { msg } from "@lingui/macro";

const errorMessage = {
    "auth/email-already-in-use": msg`This email already in use`,
    "auth/invalid-login-credentials": msg`Invalid login credentials`,
    "auth/too-many-requests": msg`Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.`,
    "auth/wrong-password": msg`The username or password was incorrect`,
    "auth/user-not-found": msg`The username or password was incorrect`,
    "network-failed": msg`Network request failed`,
    "upload-image-failed": msg`Could not upload image`,
    "account-logged-in-already": msg`Your account has been logged into another device.`,
    "device-rooted-jailbroken": msg`Your device is rooted/jailbroken, for security reason we have stopped the app on rooted/jailbroken device.`,
    "auth/network-request-failed": msg`Network request failed`,
    "account-synced-failed": msg`This account is not active. Please contact an administrator if you believe this is an error.`,
    "file-does-not-exist": msg`File does not exist`,
    "connection-error": msg`Your connection has encountered an issue. Please try signing in again.`,
    "send-message-failed": msg`Message failed to send`,
    default: msg`Something went wrong.`
};

export default errorMessage;
