

```python
# Dependencies
import pandas as pd
import numpy as np
import requests
import json
import seaborn as sns
import pymongo

# Google API Key
from config import gkey

# mLab database auth
dbuser = "admin"
dbpassword = ""

```

#### Processing notes:
    NOTES: 
    
    Each dataset (amazon and google was pre-processed in Excel for:

    1) faulty data entries 
    2) non US State locations
    3) data inconsistancies
    
    This notbook processes the refined AMAZON data into a database:
    
    1) A detail collection of sales data
    2) A summary by city collection for circle markers for leaflet mapping
        


## AMAZON processing


```python
# Import data (cleaned up manually prior)
detail_df = pd.read_csv("../Resources/Amazon_xxxx_CSV.csv")

cm = sns.light_palette("green", as_cmap=True)
detail_df.style.background_gradient(cmap=cm)

```


```python
detail_df.info()
```


```python
# Add columns for lat, lng
detail_df["lat"] = ""
detail_df["lng"] = ""

cm = sns.light_palette("yellowgreen", as_cmap=True)
detail_df.style.background_gradient(cmap=cm)

```

### Add lat lng through AMAZON API to dataframe


```python
params = {"key": gkey}

# Loop through the ga_pd and run a lat/long search for each city
for index, row in detail_df.iterrows():
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"

    city = row['city']
    state = row['state']

    # update address key value
    params['address'] = f"{city},{state}"

    # make request (params is a dictionary of gky and city and state)
    geo_data = requests.get(base_url, params=params)
    
    # convert object to json style data (dict)
    geo_data = geo_data.json()
    
    # Update ga_pd dataframe with each city's lat, lng
    lat = geo_data["results"][0]["geometry"]["location"]["lat"]
    lng = geo_data["results"][0]["geometry"]["location"]["lng"]
   
    
    print(str(index) + " " + city + " " + str(lat) + ", " + str(lng))
    detail_df.loc[index, "lat"] = lat
    detail_df.loc[index, "lng"] = lng
 
    
```


```python
cm = sns.light_palette("yellow", as_cmap=True)
detail_df.style.background_gradient(cmap=cm)

```


```python
detail_df.info()
```

### Pass AMAZON detail data to MONGODB


```python
# Prepare to pass to database mLab
detail_dict = detail_df.to_dict(orient = "records")
```


```python
# Use mLab for data base
conn = f"mongodb://{dbuser}:{dbpassword}@ds111113.mlab.com:11113/carriers"
client = pymongo.MongoClient(conn)
# Predefined Database in mlab

# Add to Collections in Database
db = client.xxxxxxxx
amz_detail = db.amz_detail
```


```python
# Insert data to database
#amz_detail.insert_many(detail_dict)
```

### Create summary file by city and sort by REVENUE low to high for web circle application


```python
# Copy DataFrame
sum_df = detail_df
sum_df.drop(columns="order_id", inplace=True)

```


```python
cm = sns.light_palette("lightyellow", as_cmap=True)
sum_df.style.background_gradient(cmap=cm)

```


```python
count_transactions = sum_df.groupby(['city','state'],as_index = False).count()['revenue']
count_transactions
```


```python
# Grouped revenue to series
revenue = sum_df.groupby(['city','state'],as_index = False).sum()['revenue']
revenue
```


```python
# Create new df of grouped city/state with NO transactionId for Database collection - circles map
sum_df = sum_df.groupby(['amazon','city','state','lat','lng'],as_index = False).mean()
cm = sns.light_palette("orange", as_cmap=True)
sum_df.style.background_gradient(cmap=cm)

```


```python
sum_df['revenue'] = revenue

cm = sns.light_palette("orangered", as_cmap=True)
sum_df.style.background_gradient(cmap=cm)

```


```python
sum_df['transactions'] = count_transactions
cm = sns.light_palette("purple", as_cmap=True)
sum_df.style.background_gradient(cmap=cm)

```


```python
# Check Records
sum_df.info()
```


```python
# Resort SORTED df by revenue for ordering in Leaflet of circles
sum_df.sort_values('revenue', inplace=True)

cm = sns.light_palette("blue", as_cmap=True)
sum_df.style.background_gradient(cmap=cm)

```


```python
# Prepare to pass datato mLab MONGO database
sum_dict = sum_df.to_dict(orient = "records")
```


```python
sum_dict
```

### Pass AMAZON summary data to MONGODB


```python
# Use mLab for data base
conn = f"mongodb://{dbuser}:{dbpassword}@ds111113.mlab.com:11113/carriers"
client = pymongo.MongoClient(conn)

# Predefined Database in mlab
db = client.xxxxxxx
# Add to Collections in Database
amz_sum = db.amz_sum
```


```python
# Add to mLab database
#amz_sum.insert_many(sum_dict)
```


```python
# Done
```
