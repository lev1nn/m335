export interface Photo {
  id: number;
  base64: string;
  dateTime: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  //direction: string;
  batteryLevel: number;
}
