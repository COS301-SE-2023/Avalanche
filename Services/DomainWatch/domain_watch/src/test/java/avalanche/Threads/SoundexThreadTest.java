package avalanche.Threads;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.junit.jupiter.api.Test;

import avalanche.DataClasses.Domain;

public class SoundexThreadTest {
    @Test
    public void testOnListWithNull() {
        ConcurrentLinkedQueue<Domain> hits = new ConcurrentLinkedQueue<>();
        Queue<Domain> allDomains = new LinkedList<>();
        allDomains.add(null);
        allDomains.add(new Domain("hi", "CO.ZA"));
        SoundexThread thread = new SoundexThread("hi", 0, hits, allDomains);
        thread.run();
        while (thread.isAlive()) {
        }
        assertEquals(1, hits.size());
    }
}
