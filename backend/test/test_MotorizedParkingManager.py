import requests

# Testing Endpoint
ENDPOINT = 'http://127.0.0.1:8080/parking/motorized/search'

# Testing Function
test_cases_passed = 0

def test_endpoint(endpoint, query_params, valid):
    global test_cases_passed
    response = requests.get(endpoint, params=query_params)

    print(query_params)
    print("Status code: ", response.status_code)
    
    if valid:
        assert response.status_code == 200, "Test Failed"
    else:
        assert response.status_code == 404 or response.status_code == 500, "Test Failed"
    test_cases_passed += 1
    print(f"test case {test_cases_passed} passed")
    print()

# Parameters List
params_list = {
    'place-id': {
        'valid': ['ChIJ-ZtvtowZ2jER4uzcVTpI2S0'],
        'invalid': ['ChIJ-ZtvtowZ2jER4uzcVTpI2S0a']
    },
    'day': {
        'valid': ['mon'],
        'invalid': ['weekday']
    },
    'time': {
        'valid': ['00:00:00', '23:59:59'],
        'invalid': ['24:00:01']
    },
    'order': {
        'valid': ['price'],
        'invalid': ['time']
    },
    'vehicle-type': {
        'valid': ['C', 'H', 'Y'],
        'invalid': ['B']
    },
    'price-start': {
        'valid': [0, 10],
        'invalid': [-1]
    },    
    'price-end': {
        'valid': [0, 10],
        'invalid': [-1, 11]
    },    
}


# Test Valid Requests
print("\nTesting Valid Requests")
for place_id in params_list['place-id']['valid']:
    for day in params_list['day']['valid']:
        for time in params_list['time']['valid']:
            for order in params_list['order']['valid']:
                for vehicle_type in params_list['vehicle-type']['valid']:
                    for price_start in params_list['price-start']['valid']:
                        for price_end in params_list['price-end']['valid']:
                            params = {
                                'place-id': place_id,
                                'day': day,
                                'time': time,
                                'order': order,
                                'vehicle-type': vehicle_type,
                                'price-start': price_start,
                                'price-end': price_end
                            }
                            test_endpoint(ENDPOINT, params, True)

# Test Invalid Requests
print("\nTesting Invalid Requests")
for (param, values) in params_list.items():
    for value in values['invalid']:
        params = {
            'place-id': 'ChIJ-ZtvtowZ2jER4uzcVTpI2S0',
            'day': 'mon',
            'time': '00:00:00',
            'order': 'price',
            'vehicle-type': 'C',
            'price-start': 0,
            'price-end': 10
        }
        params[param] = value
        test_endpoint(ENDPOINT, params, False)