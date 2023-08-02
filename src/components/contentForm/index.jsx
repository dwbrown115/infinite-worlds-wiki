import { useState, useEffect } from "react";

import { jsonParser, checkImage } from "../../helpers";
import { getData } from "../../firebase";

// eslint-disable-next-line react/prop-types
function ContentForm({
    handleFormContents,
    isManualOfStyle,
    section,
    reset,
    edited,
    path,
    contentName,
}) {
    const [sections, setSections] = useState([]);
    const [edit, setEdit] = useState(jsonParser(localStorage.getItem(edited)));
    const [confirm, setConfirm] = useState(false);

    async function grabDataBaseContent() {
        if (path) {
            const dataSnap = await getData(path, section);
            if (dataSnap) {
                console.log("Grabbing from database");
                // console.log(dataSnap);
                setSections(dataSnap.content);
                localStorage.setItem(
                    `${contentName}${section}`,
                    JSON.stringify(dataSnap)
                );
                localStorage.setItem(`${contentName}${section}Grabbed`, true);
            } else {
                console.log("No data found");
            }
        }
    }

    function grabLocalStorage(location) {
        const storedArray = jsonParser(localStorage.getItem(location));
        // console.log(storedArray);
        if (storedArray) {
            if (storedArray.content != null) {
                // console.log("Defined");
                if (storedArray.content != undefined) {
                    setSections(storedArray.content);
                }
            }
        }
    }

    function grabEdit() {
        if (edit == null) {
            setEdit(false);
        }
    }

    useEffect(() => {
        // console.log(edit);
        // setEdit(jsonParser(localStorage.getItem(edited)));
    }, [edited]);

    useEffect(() => {
        grabEdit();
        // console.log(contentName + section);
        const grabbedDataBase = jsonParser(
            localStorage.getItem(`${contentName}${section}Grabbed`)
        );
        if (!grabbedDataBase) {
            // grabDataBaseContent();
            if (contentName) {
                grabDataBaseContent();
                // localStorage.setItem(`${contentName}${section}Grabbed`, true);
            } else if (!contentName) {
                grabLocalStorage(section);
            }
        } else if (grabbedDataBase) {
            console.log("Grabbing from local storage");
            grabLocalStorage(`${contentName}${section}`);
        }
        // console.log(grabbedDataBase);
        // localStorage.setItem(`${contentName}${section}Grabbed`, true)
        // if (contentName) {
        //     grabLocalStorage(`${contentName}${section}`);
        // } else if (!contentName) {
        //     grabLocalStorage(section);
        // }
        // const storedArray = jsonParser(
        //     localStorage.getItem(`${contentName}${section}`)
        // );
        // if (storedArray) {
        //     console.log("Defined");
        // } else {
        //     console.log("Not Defined");
        // }
        // if (edit == true) {
        //     checkForContentName();
        // } else if (edit == false) {
        //     // grabDataBaseContent();
        //     console.log("Grabbing from database");
        // }
    }, [edit]);

    useEffect(() => {
        handleFormContents(sections);
    }, [sections]);

    useEffect(() => {
        if (reset == true) {
            // console.log(reset);
            removeAllObjects(sections);
            localStorage.removeItem(section);
        } else if (reset == false) {
            // console.log(reset);
        }
    }, [reset]);

    function removeAllObjects(arr) {
        arr.splice(0, arr.length);
    }

    function handleReset() {
        removeAllObjects(sections);
        setConfirm(false);
        localStorage.removeItem(section);
    }

    const addSection = () => {
        setSections([
            ...sections,
            { sectionName: "", sectionContent: [], sectionImage: null },
        ]);
    };

    const addContent = (index) => {
        const newSections = [...sections];
        newSections[index].sectionContent.push({ title: "", text: "" });
        setSections(newSections);
    };

    const addImage = (index) => {
        const newSections = [...sections];
        newSections[index].sectionImage = "";
        setSections(newSections);
    };

    const handleChange = (e, index, type) => {
        const newSections = [...sections];
        if (type === "sectionName") {
            newSections[index].sectionName = e.target.value;
        } else if (type === "title") {
            newSections[index].sectionContent[
                e.target.dataset.contentIndex
            ].title = e.target.value;
        } else if (type === "text") {
            newSections[index].sectionContent[
                e.target.dataset.contentIndex
            ].text = e.target.value;
        }
        setSections(newSections);
    };

    // This is the function that handles the image change event
    const handleImageChange = (e, index) => {
        const newSections = [...sections];
        if (e.target.files && e.target.files[0]) {
            // Use FileReader to convert the image file to a data URL
            const reader = new FileReader();
            reader.onload = () => {
                newSections[index].sectionImage = e.target.files[0];
                setSections(newSections);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // This is the new function that handles the section removal
    const removeSection = (index) => {
        const newSections = [...sections];
        newSections.splice(index, 1); // Remove the section at the given index
        setSections(newSections);
    };

    // This is the new function that handles the content removal
    const removeContent = (index, contentIndex) => {
        const newSections = [...sections];
        newSections[index].sectionContent.splice(contentIndex, 1); // Remove the content at the given index
        setSections(newSections);
    };

    // This is the new function that handles the image removal
    const removeImage = (index) => {
        const newSections = [...sections];
        newSections[index].sectionImage = null; // Set the image to null
        setSections(newSections);
    };

    // This is the function that renders the sections
    const renderSections = (sections) => {
        return sections?.map((section, index) => (
            <div key={index} className="section">
                <br />
                <label htmlFor={`sectionName${index}`}>Section Name:</label>
                <input
                    id={`sectionName${index}`}
                    type="text"
                    // eslint-disable-next-line react/prop-types
                    value={section.sectionName}
                    onChange={(e) => handleChange(e, index, "sectionName")}
                    required
                />
                <button type="button" onClick={() => removeSection(index)}>
                    Remove Section
                </button>
                <br />
                {/* eslint-disable-next-line react/prop-types */}
                {/* {section.sectionImage === null ? (
                    <button type="button" onClick={() => addImage(index)}>
                        Add Image
                    </button>
                ) : (
                    <div />
                )} */}
                <br />
                {/* eslint-disable-next-line react/prop-types */}
                {/* {section.imageUrl === null ? (
                    <div>
                        <div>Current Image:</div>
                        <img src={section.imageUrl} alt="current image" />
                    </div>
                ) : (
                    <div />
                )} */}

                {section.sectionImage !== null && (
                    <div className="image">
                        <label htmlFor={`image${index}`}>Image:</label>
                        <input
                            id={`image${index}`}
                            type="file"
                            name="myImage"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            required
                        />
                        {/* eslint-disable-next-line react/prop-types */}
                        {section.sectionImage && (
                            <img
                                // eslint-disable-next-line react/prop-types
                                src={checkImage(section.sectionImage)}
                                alt="re-upload image"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                        >
                            Remove Image
                        </button>
                    </div>
                )}
                {/* eslint-disable-next-line react/prop-types */}
                {section.sectionContent.map((content, contentIndex) => (
                    <div key={contentIndex} className="content">
                        {isManualOfStyle === true ? (
                            <div>
                                <label htmlFor={`title${index}${contentIndex}`}>
                                    Title:
                                </label>
                                <input
                                    id={`title${index}${contentIndex}`}
                                    type="text"
                                    value={content.title}
                                    data-content-index={contentIndex}
                                    onChange={(e) =>
                                        handleChange(e, index, "title")
                                    }
                                />
                            </div>
                        ) : (
                            <div />
                        )}
                        {isManualOfStyle === true ? (
                            <label htmlFor={`text${index}${contentIndex}`}>
                                Text:
                            </label>
                        ) : (
                            <label htmlFor={`text${index}${contentIndex}`}>
                                Paragraph:
                            </label>
                        )}
                        <textarea
                            id={`text${index}${contentIndex}`}
                            type="text"
                            value={content.text}
                            data-content-index={contentIndex}
                            onChange={(e) => handleChange(e, index, "text")}
                        />
                        {/* This is the new button to remove a content */}
                        <button
                            type="button"
                            onClick={() => removeContent(index, contentIndex)}
                        >
                            Remove Content
                        </button>
                    </div>
                ))}
                {/* <br /> */}
                {isManualOfStyle === true ? (
                    <button type="button" onClick={() => addContent(index)}>
                        Add Content
                    </button>
                ) : (
                    <button type="button" onClick={() => addContent(index)}>
                        Add Paragraph
                    </button>
                )}
            </div>
        ));
    };

    function handleContent() {
        return (
            <div className="contentForm">
                <div>
                    {renderSections(sections)}
                    <br />
                    <button type="button" onClick={addSection}>
                        Add Section
                    </button>
                </div>
                <br />
                {sections?.length === 0 ? (
                    <div />
                ) : (
                    <div>
                        {confirm === false ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirm(true);
                                }}
                            >
                                Reset
                            </button>
                        ) : (
                            <div />
                        )}
                        {confirm === true ? (
                            <>
                                <button
                                    onClick={() => {
                                        setConfirm(false);
                                    }}
                                >
                                    Cancel reset
                                </button>
                                <button onClick={handleReset}>
                                    Confirm reset
                                </button>
                            </>
                        ) : (
                            <div />
                        )}
                    </div>
                )}
            </div>
        );
    }

    return <>{handleContent()}</>;
}
export default ContentForm;
