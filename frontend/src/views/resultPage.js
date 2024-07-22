import { React, useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import "./resultPage.css";
import DonutCharts from "../components/DonutCharts";
import AuthContext from "../context/AuthContext";
import LineChart from "../components/LineChart";
import HorizontalBarChart from "../components/HorizontalBarChart";

const initdata = {
    occupation: {
        time: [],
        avg: [],
        score: [],
        description: "현재 설명 및 그래프는 commonsense 만 제공됩니다. 죄송합니다.",
        cat : [],
        percentage: [],
    },
    communication: {
        time: [],
        avg: [],
        score: [],
        description: "현재 설명 및 그래프는 commonsense 만 제공됩니다. 죄송합니다.",
        cat : [],
        percentage: [],
    },
    commonsense: {
        time: [],
        avg: [],
        score: [],
        description: "현재 설명 및 그래프는 commonsense 만 제공됩니다. 죄송합니다.",
        cat : [],
        percentage: [],
    },
    tools: {
        time: [],
        avg: [],
        score: [],
        description: "현재 설명 및 그래프는 commonsense 만 제공됩니다. 죄송합니다.",
        cat : [],
        percentage: [],
    },
    ethic: {
        time: [],
        avg: [],
        score: [],
        description: "현재 설명 및 그래프는 commonsense 만 제공됩니다. 죄송합니다.",
        cat : [],
        percentage: [],
    },
};

const ResultPage = () => {
    const [scoreData, setScoreData] = useState({});
    const [allData, setAllData] = useState(initdata);
    const [descriptionData, setDescriptionData] = useState("");
    const { user } = useContext(AuthContext);
    const [cat, setCat] = useState(0);
    const catN2S = [
        "occupation",
        "communication",
        "commonsense",
        "tools",
        "ethic",
    ];
    const color = ["#FFD2D3", "#FFF7DB", "#F4FFE1", "#DEEFFF", "#F4DDFF"];

    const getDictData = (nestedJsonData, dynamicPath) => {
        let value = nestedJsonData;
        for (const path of dynamicPath) {
            value = value[path];
        }
        return value;
    };

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/learn/score/`,
                    {
                        // 백엔드 서버에 메시지를 POST 요청
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_no: user.user_no }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setScoreData(data.result ? data.result : {});
                    // console.log(data.result);
                } else {
                    console.error("Failed to fetch score data");
                }
            } catch (error) {
                console.error("Error fetching score data", error);
            }
        };

        if (user) {
            fetchScore();
        }
    }, [user]);

    useEffect(() => {
        setDescriptionData(getDictData(allData, [catN2S[cat], "description"]));
        // console.log(cat);
    }, [cat]);
    useEffect(() => {
        const fetchCommonsenseData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/filter_test/feedback/`,
                    {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_no: user.user_no }),
                });
    
                if (response.ok) {
                    const commonsenseData = await response.json();
                    // Update the commonsense part of your data object
                    // data.commonsense = {
                    //     ...commonsenseData,
                    // };
                    // Update the state if necessary
                    // setScoreData({...data});

                    // console.log(commonsenseData);


                    const newDataState = {
                        ...allData,  // 기존 상태를 복사합니다.
                        commonsense: {...commonsenseData}
                        // 다른 필드도 필요에 따라 업데이트할 수 있습니다.
                      };
                  
                    // console.log(newDataState);
                    setAllData(newDataState);
                } else {
                    console.error("Failed to fetch commonsense data");
                }
            } catch (error) {
                console.error("Error fetching commonsense data", error);
            }
        };
    
        if (user) {
            fetchCommonsenseData();
        }
    }, []);

    if (!user) {
        // console.log("redirect");
        return <Navigate to="/login" />;
        // return;
    }

    return (
        <section className="result_page">
            <div className="result_page_chart">
                <div className="result_page_donut_chart">
                    <div className="pentagon"></div>
                    <DonutCharts
                        data={scoreData}
                        backgroundColor={"rgba(117, 138, 249, 0)"}
                        setCat={setCat}
                    />
                </div>
                <div className="result_page_line_chart">
                    <LineChart data={allData} cat={cat} />
                </div>
            </div>
            <div className="result_page_desc">
                <div
                    className="result_page_desc_inner"
                    style={{ borderColor: `${color[cat]}` }}
                >
                    <p className="title_occ">{`${user.name} 님의 ${catN2S[cat]} 설명입니다.`}</p>
                    <HorizontalBarChart catData={allData[catN2S[cat]]["percentage"]} labels= {allData[catN2S[cat]]["cat"] } color={color[cat]}/>
                    {descriptionData}
                </div>
            </div>
        </section>
    );
};

export default ResultPage;
