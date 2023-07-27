import { useState, useEffect } from "react";

function ContentForm( handleFormContents, isManualOfStyle, section, reset ) {
    const [sections, setSections] = useState(section);
    const [isReset, setIsReset] = useState(reset);
    const [confirm, setConfirm] = useState(false);

    // const [showSections, setShowSections] = useState(false);

    function removeAllObjects(arr) {
        arr.splice(0, arr.length);
    }

    useEffect(() => {
        handleFormContents(sections);
    }, [sections]);

    useEffect(() => {
        setIsReset(reset);
    }, [reset]);

    useEffect(() => {
        // console.log(isReset);
        if (isReset == true) {
            removeAllObjects(sections);
        } else {
            removeAllObjects(sections);
        }
    }, [isReset]);

    function handleReset() {
        removeAllObjects(sections);
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
        return sections.map((section, index) => (
            <div key={index} className="section">
                <br />
                <label htmlFor={`sectionName${index}`}>Section Name:</label>
                <input
                    id={`sectionName${index}`}
                    type="text"
                    value={section.sectionName}
                    onChange={(e) => handleChange(e, index, "sectionName")}
                    required
                />
                <button type="button" onClick={() => removeSection(index)}>
                    Remove Section
                </button>
                <br />
                {/* This is the button to add an image */}
                {section.sectionImage === null ? (
                    <button type="button" onClick={() => addImage(index)}>
                        Add Image
                    </button>
                ) : (
                    <div />
                )}
                <br />
                {/* <br /> */}
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
                        {section.sectionImage && (
                            <img
                                src={URL.createObjectURL(section.sectionImage)}
                                alt="Section Image"
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

    // This is the function that maps the sections array and displays it as a list

    // function handleReset() {
    //     setSections([]);
    // }

    return (
        <div className="contentForm">
            {/* <h1>React JS Form</h1> */}
            {/* <form onSubmit={handleSubmit}> */}
            <div>
                {renderSections(sections)}
                <br />
                <button type="button" onClick={addSection}>
                    Add Section
                </button>
                {/* <button type="submit">Submit</button> */}
                {/* </form> */}
            </div>
            {/* <br /> */}
            {/* <button onClick={handleReset}>Reset</button> */}
            {/* <br /> */}
            <br />
            {sections.length === 0 ? (
                <div />
            ) : (
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            setConfirm(true);
                        }}
                    >
                        Reset
                    </button>
                    {confirm === true ? (
                        <button
                            type="button"
                            onClick={() => {
                                setConfirm(false), handleReset();
                            }}
                        >
                            Confirm reset
                        </button>
                    ) : (
                        <div />
                    )}
                </div>
            )}
        </div>
    );
}
export default ContentForm;
