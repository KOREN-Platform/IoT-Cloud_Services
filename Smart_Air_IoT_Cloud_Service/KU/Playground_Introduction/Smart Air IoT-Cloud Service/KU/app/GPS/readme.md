# Example

GpsInfo gps;

gps = new GpsInfo(MainActivity.this);

if(gps.isGetLocation()){

  double lat = gps.getLatitude();
  
  double lng = gps.getLongitude();
  
}else{

  gps.showSettingsAlert();
  
}


# Version >= 6.0
https://developer.android.com/training/permissions/requesting.html
