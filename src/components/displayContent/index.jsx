import React from "react";

import "./displayContent.scss";

function DisplayContent({ array, isManualOfStyle }) {
    return (
        <>
            {array.content?.map((item, index) => {
                return (
                    <div className="ContentWrapper" key={index}>
                        <h2>{item.sectionName}</h2>
                        {item.imageUrl && (
                            <img
                                style={{ width: "50%", height: "50%" }}
                                src={item.imageUrl}
                                alt={`${item.sectionName}.jpg`}
                            />
                        )}
                        {item.sectionContent.map((item, index) => {
                            return (
                                <div key={index}>
                                    {isManualOfStyle ? (
                                        <div className="ManualofStyleSectionContent">
                                            {isManualOfStyle && (
                                                <div>{item.title}</div>
                                            )}
                                            <div>{item.text}</div>
                                        </div>
                                    ) : (
                                        <div className="SectionContent">
                                            <div>{item.title}</div>
                                            <div>{item.text}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
}

export default DisplayContent;
