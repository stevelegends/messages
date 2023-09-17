// react
import { useCallback } from "react";

// actions
import { decrement, increment, incrementByAmount } from "@store/features/counter/counter-slice";

// hooks
import { useAppSelector, useAppDispatch } from "@hooks/index";

const useCounter = () => {
    const dispatch = useAppDispatch();

    const count = useAppSelector(state => state.counterReducer.value);

    const incrementValue = useCallback(() => dispatch(increment()), []);

    const decrementValue = useCallback(() => dispatch(decrement()), []);

    const incrementByAmountValue = useCallback(
        (payload: number) => dispatch(incrementByAmount(payload)),
        []
    );

    return {
        count,
        incrementValue,
        decrementValue,
        incrementByAmountValue
    };
};

export default useCounter;
