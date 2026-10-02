# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
import plotly.express as px
import numpy as np

# Set page configuration
st.set_page_config(
    page_title="Customer Churn Analysis Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for premium look
st.markdown("""
    <style>
    .main {
        background-color: #0e1117;
    }
    .stMetric {
        background-color: #1e2130;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    h1, h2, h3 {
        color: #00d4ff;
    }
    </style>
    """, unsafe_allow_html=True)

# Function to load and clean data
@st.cache_data
def load_data():
    df = pd.read_csv('Customer-Churn.csv')
    
    # Cleaning as per notebook logic
    # 1. TotalCharges has some blank spaces
    df['TotalCharges'] = df['TotalCharges'].replace(" ", "0")
    df['TotalCharges'] = df['TotalCharges'].astype(float)
    
    # 2. Reformat SeniorCitizen for better readability
    df['SeniorCitizen'] = df['SeniorCitizen'].map({0: 'No', 1: 'Yes'})
    
    return df

try:
    df = load_data()
except FileNotFoundError:
    st.error("Dataset 'Customer-Churn.csv' not found. Please ensure the file is in the application directory.")
    st.stop()

# --- SIDEBAR FILTERS ---
with st.sidebar.form("filter_form"):
    st.title("🔍 Filter Options")
    st.markdown("Select options and click 'Apply' to update the dashboard.")

    # Categorical filters
    gender_options = sorted(df['gender'].unique())
    gender = st.multiselect("Gender", options=gender_options, default=gender_options)
    
    senior_options = sorted(df['SeniorCitizen'].unique())
    senior = st.multiselect("Senior Citizen", options=senior_options, default=senior_options)
    
    partner_options = sorted(df['Partner'].unique())
    partner = st.multiselect("Partner", options=partner_options, default=partner_options)
    
    contract_options = sorted(df['Contract'].unique())
    contract = st.multiselect("Contract Type", options=contract_options, default=contract_options)
    
    internet_options = sorted(df['InternetService'].unique())
    internet = st.multiselect("Internet Service", options=internet_options, default=internet_options)

    submit_button = st.form_submit_button("Apply Filters")

# Apply filters (even if button not clicked, show default filtered view)
filtered_df = df[
    (df['gender'].isin(gender)) & 
    (df['SeniorCitizen'].isin(senior)) & 
    (df['Partner'].isin(partner)) & 
    (df['Contract'].isin(contract)) &
    (df['InternetService'].isin(internet))
]

# --- MAIN DASHBOARD ---
st.title("📊 Customer Churn Analysis Dashboard")
st.markdown("---")

# Metrics row
col1, col2, col3, col4 = st.columns(4)

total_cust = len(filtered_df)
churned_cust = len(filtered_df[filtered_df['Churn'] == 'Yes'])
churn_rate = (churned_cust / total_cust * 100) if total_cust > 0 else 0
avg_monthly = filtered_df['MonthlyCharges'].mean() if total_cust > 0 else 0

with col1:
    st.metric("Total Customers", f"{total_cust:,}")
with col2:
    st.metric("Churned Customers", f"{churned_cust:,}", delta=f"{churn_rate:.1f}% Rate", delta_color="inverse")
with col3:
    st.metric("Churn Rate", f"{churn_rate:.1f}%")
with col4:
    st.metric("Avg Monthly Charges", f"${avg_monthly:.2f}")

st.markdown("---")

# Visualizations Row 1
v_col1, v_col2 = st.columns(2)

with v_col1:
    st.subheader("Churn Distribution")
    churn_counts = filtered_df['Churn'].value_counts().reset_index()
    churn_counts.columns = ['Churn', 'Count']
    fig_pie = px.pie(churn_counts, values='Count', names='Churn', 
                     color='Churn', color_discrete_map={'No':'#00d4ff', 'Yes':'#ff4b4b'},
                     hole=0.4, template="plotly_dark")
    st.plotly_chart(fig_pie, width='stretch')

with v_col2:
    st.subheader("Monthly Charges vs Churn")
    fig_hist = px.histogram(filtered_df, x="MonthlyCharges", color="Churn",
                           barmode="overlay", nbins=30,
                           color_discrete_map={'No':'#00d4ff', 'Yes':'#ff4b4b'},
                           template="plotly_dark")
    fig_hist.update_layout(xaxis_title="Monthly Charges ($)", yaxis_title="Customer Count")
    st.plotly_chart(fig_hist, width='stretch')

# Visualizations Row 2 - Interactive Feature Explorer
st.markdown("---")
st.subheader("🔎 In-depth Feature Explorer")
st.write("Analyze churn rates across different customer attributes.")

explore_feature = st.selectbox("Select characteristic to analyze:", 
                                ['gender', 'SeniorCitizen', 'Partner', 'Dependents', 
                                 'PhoneService', 'MultipleLines', 'InternetService', 
                                 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 
                                 'TechSupport', 'StreamingTV', 'StreamingMovies', 
                                 'Contract', 'PaperlessBilling', 'PaymentMethod'])

# Grouped bar chart for churn by selected feature
feature_churn = filtered_df.groupby([explore_feature, 'Churn']).size().reset_index(name='Count')
fig_bar = px.bar(feature_churn, x=explore_feature, y='Count', color='Churn',
                 barmode='group', color_discrete_map={'No':'#00d4ff', 'Yes':'#ff4b4b'},
                 template="plotly_dark", text_auto=True)
fig_bar.update_layout(xaxis_title=explore_feature.capitalize(), yaxis_title="Number of Customers")
st.plotly_chart(fig_bar, width='stretch')

# Data Preview
st.markdown("---")
with st.expander("📄 View Filtered Data Preview"):
    st.dataframe(filtered_df.head(100), width='stretch')

st.sidebar.markdown("---")
st.sidebar.info("Developed by Antigravity 🚀")
