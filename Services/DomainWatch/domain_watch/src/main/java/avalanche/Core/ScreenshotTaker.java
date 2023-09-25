package avalanche.Core;

import java.io.FileWriter;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.checkerframework.checker.units.qual.degrees;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class ScreenshotTaker {

    private static WebDriver driver;

    public static String takeScreenshot(String domainName) {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--window-size=1920,1080", "headless");

        WebDriver driver = new ChromeDriver(options);

        driver.get("http://" + domainName);
        JavascriptExecutor jse = (JavascriptExecutor) driver;
        // Getting DOM status
        Object result = jse.executeScript("return document.readyState;");
        System.out.println("=> The status is : " + result.toString());
        // Checking DOM loading is completed or not?
        if (result.equals("complete")) {
            // Fetching images count
            result = jse.executeScript("return document.images.length");
            int imagesCount = Integer.parseInt(result.toString());
            boolean allLoaded = false;
            // Checking and waiting until all the images are getting loaded
            while (!allLoaded) {
                int count = 0;
                for (int i = 0; i < imagesCount; i++) {
                    result = jse.executeScript("return document.images[" + i + "].complete;");
                    boolean loaded = (Boolean) result;
                    if (loaded)
                        count++;
                }
                // Breaking the while loop if all the images loading completes
                if (count == imagesCount) {
                    System.out.println("=> All the Images are loaded...");
                    break;
                } else {
                }
            }
        }
        String img = (((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64));
        try {
            FileWriter w = new FileWriter("out.txt");
            w.write(img);
            w.flush();
            w.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        driver.quit();
        return img;
    }

    public static void main(String[] args) throws InterruptedException {

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--window-size=1920,1080", "headless");

        WebDriver driver = new ChromeDriver(options);

        driver.get("http://avalanche.sloththe.dev");
        JavascriptExecutor jse = (JavascriptExecutor) driver;
        // Getting DOM status
        Object result = jse.executeScript("return document.readyState;");
        System.out.println("=> The status is : " + result.toString());
        // Checking DOM loading is completed or not?
        if (result.equals("complete")) {
            // Fetching images count
            result = jse.executeScript("return document.images.length");
            int imagesCount = Integer.parseInt(result.toString());
            boolean allLoaded = false;
            // Checking and waiting until all the images are getting loaded
            while (!allLoaded) {
                int count = 0;
                for (int i = 0; i < imagesCount; i++) {
                    result = jse.executeScript("return document.images[" + i + "].complete;");
                    boolean loaded = (Boolean) result;
                    if (loaded)
                        count++;
                }
                // Breaking the while loop if all the images loading completes
                if (count == imagesCount) {
                    System.out.println("=> All the Images are loaded...");
                    break;
                } else {
                }
            }
        }
        String img = (((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64));
        try {
            FileWriter w = new FileWriter("out.txt");
            w.write(img);
            w.flush();
            w.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        driver.quit();
    }
}
