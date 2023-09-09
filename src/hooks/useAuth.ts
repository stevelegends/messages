import { useMemo } from "react";

const useAuth = () => {
    const isAuth = useMemo(() => true, []);

    return { isAuth };
};

export default useAuth;
