#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#----------------------------------------------------------------------------
# Created By  : Mario (Ornitorinco)
# Created Date: 2022/11/04
# version = '1.0'
# ---------------------------------------------------------------------------

# Import required libraries
import numpy as np
import pandas as pd
import geojson

# Load the GeoJSON file
with open("../data/raw_data/geo_data_trees.geojson") as f:
    gj = geojson.load(f)
    
# Extract the features
dataset = gj.features

# Extract a list of dicts, where each dict represents a tree with its properties
list_of_dicts = []
for element in dataset:
    list_of_dicts.append(element.properties)
    
# Build the dataframe using Pandas (we exclude the list dict because it refers to the "TOTAL")
dataframe = pd.DataFrame.from_dict(list_of_dicts[:-1])

# Update the dtypes of each variable in the dataframe with the correct one
dataframe = dataframe.astype({"Tree ID": int,
                              "Name": str,
                              "DBH (cm)": float,
                              "Replacement Value (eur)": float,
                              "Carbon Storage (kg)": float,
                              "Carbon Storage (eur)": float,
                              "Gross Carbon Sequestration (kg/yr)": float,
                              "Gross Carbon Sequestration (eur/yr)": float,
                              "Avoided Runoff (mcube/yr)": float,
                              "Avoided Runoff (eur/yr)": float,
                              "Carbon Avoided (kg/yr)": float,
                              "Carbon Avoided (eur/yr)": float,
                              "Pollution Removal (g/yr)": float,
                              "Pollution Removal (eur/yr)": float,
                              "Energy Savings (eur/yr)": float,
                              "Total Annual Benefits (eur/yr)": float,
                              "Oxygen Production (kg/yr)": float,
                              "Height (m)": float,
                              "Crown Height (m)": float,
                              "Crown Width (m)": float,
                              "Canopy Cover (m2)": float,
                              "Leaf Area (m2)": float,
                              "Leaf Biomass (kg)": float,
                              "Latitude": float,
                              "Longitude": float})

# Save the dataframe as csv file
dataframe.to_csv("../data/df_trees.csv", sep=",", index=False)

# All works properly
print("\nExtraction of dataset completed!\n")

#----------------------------------------------------------------------------
# EOF
# ---------------------------------------------------------------------------