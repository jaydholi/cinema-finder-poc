import { Chip, IconButton, ListItem, ListItemText } from "@mui/material";
import { MdCall, MdOutlineLocationOn } from 'react-icons/md';
import { format } from 'd3-format';

const dispatchMapSnapTo = (lat, lng) => {
  if (typeof lat === "number" && typeof lng === "number") {
    console.log('Triggering `map.snapTo` event with args:', `lat: ${lat}, lng: ${lng}`);
    window.dispatchEvent(new CustomEvent('map.snapTo', { detail: { lat, lng } }));
  } else {
    console.warn("Invalid coordinates for map snapping:", { lat, lng });
  }
};

const CinemaListItem = ({ name, lat, lon, phoneNumber, distance, ...otherProps }) => {
  // Convert lon to lng so it matches the map event’s expectations
  const lng = lon;

  return (
    <ListItem {...otherProps}>
      <ListItemText>
        {name}
        {distance && (
          <Chip
            size="small"
            sx={{ ml: 1 }}
            label={`${format(',.1f')(distance)} km`}
          />
        )}
      </ListItemText>

      {phoneNumber && (
        <IconButton component="a" href={`tel:${phoneNumber}`}>
          <MdCall />
        </IconButton>
      )}

      <IconButton onClick={() => dispatchMapSnapTo(lat, lng)}>
        <MdOutlineLocationOn />
      </IconButton>
    </ListItem>
  );
};

export default CinemaListItem;
