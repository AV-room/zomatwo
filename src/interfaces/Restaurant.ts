export default interface Restaurant {
  name: string;
  location: {
    address: string;
    locality: string;
    locality_verbose: string;
  };
  cuisines: string;
  phone_numbers: string;
  timings: string;
  is_table_reservation_supported: number; //?
  has_table_booking: number; //?
  has_online_delivery: number; //?
  thumb: string; //?
  featured_image: string; //?
}
