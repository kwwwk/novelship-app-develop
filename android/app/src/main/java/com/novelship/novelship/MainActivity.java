package com.novelship.novelship;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    if (android.os.Build.VERSION.SDK_INT != android.os.Build.VERSION_CODES.O) { // splashscreen crashes on Oreo
      SplashScreen.show(this, R.style.SplashScreenTheme, true);
    }
      // super.onCreate(savedInstanceState);
      super.onCreate(null); // https://github.com/software-mansion/react-native-screens#android
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "novelship";
  }
}
