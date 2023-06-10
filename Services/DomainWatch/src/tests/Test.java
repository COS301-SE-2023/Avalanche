package tests;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Test {

    public static void main(String[] args)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        LevensteinDistanceCalculatorTest t = new LevensteinDistanceCalculatorTest();
        for (Method m : t.getClass().getMethods()) {
            if (m.isAnnotationPresent(TestThis.class)) {
                m.invoke(t);
            }
        }

       
    }
}
