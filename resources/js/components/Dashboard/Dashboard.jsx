import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid2,
  List,
  ListItem,
  ListItemText,
  Button,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import GroupIcon from "@mui/icons-material/Group";
import Chart from "react-apexcharts";
import WcIcon from "@mui/icons-material/Wc";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { apiClient, getAuth } from "../../utils/authUtils";

const Dashboard = () => {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [count, setCount] = useState(null);
  const [topCompanies, setTopCompanies] = useState([]);
  const [genderData, setGenderData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);
  const [municipalityData, setMunicipalityData] = useState(null);
  const [affiliationData, setAffiliationData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [industryData, setIndustryData] = useState(null);
  const [attendanceQualificationData, setAttendanceQualificationData] = useState(null);
  const [shirtData, setShirtData] = useState(null);
  const [councilData, setCouncilData] = useState(null);
  const [regTypeData, setRegTypeData] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [eventId, setEventId] = useState(null);

  const navigate = useNavigate();
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const fetchEventDetails = async (eId) => {
    try {
      const response = await apiClient.get(`/api/events/current-event`, {
        params: { eventId: eId },
      });
      const eventData = response.data.data.event;
      const attendees = response.data.data.attendees;
      const total_registrant = response.data.data.total_registrant;

      setEvent(eventData);
      setCount(total_registrant);
      setAttendees(attendees);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const fetchTopCompanies = async (eId) => {
    try {
      const response = await apiClient.get(`/api/events/show-top-companies`, {
        params: { eventId: eId },
      });
      if (response.data.data) {
        setTopCompanies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching top companies:", error);
    }
  };

  const fetchGenderData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-gender", {
        params: { eventId: eId },
      });
      setGenderData(response.data.data);
    } catch (error) {
      console.error("Error fetching gender data:", error);
    }
  };

  const fetchProvinceData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-province", {
        params: { eventId: eId },
      });
      setProvinceData(response.data.data);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  const fetchMunicipalityData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-municipality", {
        params: { eventId: eId },
      });
      setMunicipalityData(response.data.data);
    } catch (error) {
      console.error("Error fetching municipality data:", error);
    }
  };
  
  const fetchAffiliationData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-affiliation", {
        params: { eventId: eId },
      });
      setAffiliationData(response.data.data);
    } catch (error) {
      console.error("Error fetching municipality data:", error);
    }
  };
  
  const fetchSectorData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-sector", {
        params: { eventId: eId },
      });
      setSectorData(response.data.data);
    } catch (error) {
      console.error("Error fetching sector data:", error);
    }
  };
  
  const fetchSocialData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-social", {
        params: { eventId: eId },
      });
      setSocialData(response.data.data);
    } catch (error) {
      console.error("Error fetching social data:", error);
    }
  };
  
  const fetchIndustryData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-industry", {
        params: { eventId: eId },
      });
      setIndustryData(response.data.data);
    } catch (error) {
      console.error("Error fetching industry data:", error);
    }
  };
  
  const fetchCouncilData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-council", {
        params: { eventId: eId },
      });
      setCouncilData(response.data.data);
    } catch (error) {
      console.error("Error fetching council data:", error);
    }
  };
  
  const fetchAttendanceQualificationData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-attendance-qualification", {
        params: { eventId: eId },
      });
      setAttendanceQualificationData(response.data.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };
  
   const fetchShirtData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-shirt", {
        params: { eventId: eId },
      });
      setShirtData(response.data.data);
    } catch (error) {
      console.error("Error fetching shirt data:", error);
    }
  };

  const fetchRegTypeData = async (eId) => {
    try {
      const response = await apiClient.get("/api/registrants/by-reg-type", {
        params: { eventId: eId },
      });
      setRegTypeData(response.data.data);
    } catch (error) {
      console.error("Error fetching shirt data:", error);
    }
  };

  const fetchEvents = async (eId) => {
    try {
      const response = await apiClient.get("/api/events");
      setEventList(response.data?.data?.data);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  useEffect(() => {
    if (!getAuth()) {
      navigate("/");
    }

    fetchEventDetails();
    fetchTopCompanies();
    fetchGenderData();
    fetchProvinceData();
    fetchMunicipalityData();
    fetchAffiliationData();
    fetchEvents();
    fetchSectorData();
    fetchSocialData();
    fetchIndustryData();
    fetchAttendanceQualificationData();
    fetchShirtData();
    fetchCouncilData();
    fetchRegTypeData();
  }, []);

  const handleChange = (event) => {
    let eventId = event.target.value;
    setEventId(eventId);
    fetchEventDetails(eventId);
    fetchTopCompanies(eventId);
    fetchGenderData(eventId);
    fetchProvinceData(eventId);
    fetchMunicipalityData(eventId);
    fetchAffiliationData(eventId);
    fetchSectorData(eventId);
    fetchSocialData(eventId);
    fetchIndustryData(eventId);
    fetchAttendanceQualificationData(eventId);
    fetchShirtData(eventId);
    fetchCouncilData(eventId);
    fetchRegTypeData(eventId)
  };

  const topCompaniesChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: topCompanies
        ? topCompanies.map((company) => company.company)
        : [],
    },
    colors: ["#1E88E5"],
  };

  const topCompaniesChartSeries = [
    {
      name: "Attendees",
      data: topCompanies
        ? topCompanies.map((company) => company.attendee_count)
        : [],
    },
  ];

  const genderChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: genderData ? Object.keys(genderData) : [],
  };

  const genderChartSeries = genderData ? Object.values(genderData) : [];

  const regTypeChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: regTypeData ? Object.keys(regTypeData) : [],
  };

  const regTypeChartSeries = regTypeData ? Object.values(regTypeData) : [];
  
  const sectorChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: sectorData ? Object.keys(sectorData) : [],
  };

  const sectorChartSeries = sectorData ? Object.values(sectorData) : [];
  
  const socialChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: socialData ? Object.keys(socialData) : [],
  };

  const socialChartSeries = socialData ? Object.values(socialData) : [];
  
  const industryChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: industryData ? Object.keys(industryData) : [],
  };

  const industryChartSeries = industryData ? Object.values(industryData) : [];
  
   const shirtChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: shirtData ? Object.keys(shirtData) : [],
  };

  const shirtChartSeries = shirtData ? Object.values(shirtData) : [];
  
  const attendanceQualificationChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: attendanceQualificationData ? Object.keys(attendanceQualificationData) : [],
  };

  const attendanceQualificationChartSeries = attendanceQualificationData ? Object.values(attendanceQualificationData) : [];

  const provinceChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: provinceData ? Object.keys(provinceData) : [],
    },
    colors: ["#1E88E5"],
  };

  const provinceChartSeries = [
    {
      name: "Registrants",
      data: provinceData ? Object.values(provinceData) : [],
    },
  ];

  const municipalityChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: municipalityData ? Object.keys(municipalityData) : [],
    },
    colors: ["#1E88E5"],
  };

  const municipalityChartSeries = [
    {
      name: "Registrants",
      data: municipalityData ? Object.values(municipalityData) : [],
    },
  ];
  
  const affiliationChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: affiliationData ? Object.keys(affiliationData) : [],
    },
    colors: ["#1E88E5"],
  };

  const affiliationChartSeries = [
    {
      name: "Registrants",
      data: affiliationData ? Object.values(affiliationData) : [],
    },
  ];

  const councilChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: councilData ? Object.keys(councilData) : [],
    },
    colors: ["#1E88E5"],
  };

  const councilChartSeries = [
    {
      name: "Registrants",
      data: councilData ? Object.values(councilData) : [],
    },
  ];

  return (
    <Box>
      <Toolbar
        sx={{
          display: { sm: "none" },
        }}
      />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      {event ? (
        <>
          <Grid2 container spacing={{ md: 3, sm: 2, xs: 1 }}>
            <Grid2 item size={{ xs: 12, sm: 6, md: 8 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                <EventIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                {event.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {event.location} | Date:{" "}
                {new Date(event.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Total Attendees: {attendees.length} out of {count} registrants
              </Typography>
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 6, md: 4 }}>
              {eventList.length > 0 && (
                <>
                  <Typography variant="caption">Select Event</Typography>

                  <FormControl
                    sx={{ minWidth: 120, display: "flex" }}
                    size="small"
                  >
                    <Select
                      labelId="select-event-label"
                      id="select-event"
                      value={eventId}
                      onChange={handleChange}
                    >
                      {eventList.map((event) => (
                        <MenuItem value={event.id}>{event.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 3 }} />

          <Grid2 container spacing={3}>
            <Grid2 item size={{ xs: 12, md: 6 }}>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrant Gender Distribution
                  </Typography>
                  {genderData ? (
                    <Chart
                      options={genderChartOptions}
                      series={genderChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No gender data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <GroupIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrants by Province
                  </Typography>
                  {provinceData ? (
                    <Chart
                      options={provinceChartOptions}
                      series={provinceChartSeries}
                      type="bar"
                      height={350}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No province data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrant Sector Distribution
                  </Typography>
                  {genderData ? (
                    <Chart
                      options={sectorChartOptions}
                      series={sectorChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No sectors data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrant Industry Distribution
                  </Typography>
                  {industryData ? (
                    <Chart
                      options={industryChartOptions}
                      series={industryChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No industries data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrant Attendance Qualification Distribution
                  </Typography>
                  {attendanceQualificationData ? (
                    <Chart
                      options={attendanceQualificationChartOptions}
                      series={attendanceQualificationChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No attendance qualification data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registration Type Distribution
                  </Typography>
                  {regTypeData ? (
                    <Chart
                      options={regTypeChartOptions}
                      series={regTypeChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No registration type data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    <GroupIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Top Attendees: Early Arrivals
                  </Typography>

                  {attendees.length > 0 ? (
                    <List>
                      {attendees.slice(0, 5).map((attendee) => (
                        <ListItem key={attendee.id}>
                          <ListItemText
                            primary={attendee.name}
                            secondary={[
                              attendee.company ? `${attendee.company}, ` : "",
                              dayjs(attendee.updated_at)
                                .tz("Asia/Manila")
                                .format("MM-DD-YYYY h:mm A"),
                            ]}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No attendees yet.
                    </Typography>
                  )}
                  {attendees.length > 5 && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Showing 5 of {attendees.length} attendees.
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/events")}
                  >
                    See More Details
                  </Button>
                </CardContent>
              </Card>
            </Grid2>

            <Grid2 item size={{ xs: 12, md: 6 }}>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <GroupIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrants by City / Municipality of Residence
                  </Typography>
                  {municipalityData ? (
                    <Chart
                      options={municipalityChartOptions}
                      series={municipalityChartSeries}
                      type="bar"
                      height={350}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No municipality data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <GroupIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrants by Organization/Office/Affiliation
                  </Typography>
                  {affiliationData ? (
                    <Chart
                      options={affiliationChartOptions}
                      series={affiliationChartSeries}
                      type="bar"
                      height={350}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No organization data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrant Social Classification Distribution
                  </Typography>
                  {socialData ? (
                    <Chart
                      options={socialChartOptions}
                      series={socialChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No industries data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
               <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <GroupIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrants by ICT Council
                  </Typography>
                  {councilData ? (
                    <Chart
                      options={councilChartOptions}
                      series={councilChartSeries}
                      type="bar"
                      height={350}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No ict council data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <WcIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Registrant Shirt Size Distribution
                  </Typography>
                  {shirtData ? (
                    <Chart
                      options={shirtChartOptions}
                      series={shirtChartSeries}
                      type="pie"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No shirt sizes data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
              
              <Card sx={{ mb: 3, minHeight: "350px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    <CorporateFareIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 1,
                      }}
                    />
                    Top Companies by Attendee Count
                  </Typography>
                  {topCompanies.length > 0 ? (
                    <Chart
                      options={topCompaniesChartOptions}
                      series={topCompaniesChartSeries}
                      type="bar"
                      height={350}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                    >
                      No top companies data to show
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Loading event details...
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
