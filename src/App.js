import {useRef, useEffect, useState} from 'react';

// https://developers.google.com/maps/documentation/geocoding/requests-geocoding#Types
const GOOGLE_ADDRESS_ENTITIES = {
  unitNumber: 'subpremise',
  streetNumber: 'street_number',
  street: 'route',
  city: 'locality',
  postcode: 'postal_code',
  countrySubdivision: 'administrative_area_level_1',
  countrySubdivision2: 'administrative_area_level_2',
  country: 'country'
};

const parseGoogleAutocompleteAddress = (autoComplete) => {
  // Get the place details from the autocomplete object.
  const place = autoComplete.getPlace();

  const address = {};

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr

  for (const component of place.address_components) {
    const {short_name, types} = component;
    const componentType = types[0];

    switch (componentType) {
      case GOOGLE_ADDRESS_ENTITIES.postcode: {
        address.unitNumber = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.streetNumber: {
        address.streetNumber = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.street: {
        address.street = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.city: {
        address.city = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.postcode: {
        address.postcode = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.countrySubdivision: {
        address.countrySubdivision = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.countrySubdivision2: {
        address.countrySubdivision2 = short_name;
        break;
      }
      case GOOGLE_ADDRESS_ENTITIES.country:
        address.country = short_name;
        break;
    }
  }

  // TODO delete log after debugging
  console.log({address});

  return address;
};

const AutoComplete = () => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    fields: ['address_components'],
    types: ['address']
  };

  useEffect(() => {
    if (!window?.google?.maps?.places) return;

    autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);
    autoCompleteRef.current.addListener('place_changed', () =>
      parseGoogleAutocompleteAddress(autoCompleteRef.current)
    );
  }, [options]);

  return (
    <div>
      <label>Enter address :</label>
      <input ref={inputRef} />
    </div>
  );
};

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      {show && <AutoComplete />}
      <button onClick={() => setShow((prevState) => !prevState)}>Toggle</button>
    </>
  );
};

export default App;
