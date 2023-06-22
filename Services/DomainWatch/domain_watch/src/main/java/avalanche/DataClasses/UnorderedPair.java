package avalanche.DataClasses;

public class UnorderedPair<T> {
    private T element1;
    private T element2;

    public UnorderedPair(T e1, T e2) {
        this.element1 = e1;
        this.element2 = e2;
    }

    public T getElement1() {
        return element1;
    }

    public T getElement2() {
        return element2;
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof UnorderedPair)) {
            return false;
        }
        UnorderedPair up = (UnorderedPair) (obj);
        if ((up.element1.equals(element1) && up.element2.equals(element2))
                || (up.element2.equals(element1) && up.element1.equals(element2))) {
            return true;
        }
        return false;
    }

    public int hashcode() {
        return element1.hashCode() + element2.hashCode();

    }

    @Override
    public String toString() {
        return "e1:" + element1 + " e2:" + element2;
    }

}
