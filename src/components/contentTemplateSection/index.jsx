import { useEffect, useState } from "react";

import { ContentForm } from "../../components";
import { replaceImage } from "../../helpers";
import { addData } from "../../firebase";
function ContentTemplateSection({
    type,
    section,
    sectionName,
    name,
    path,
    submit,
    manualOfStyle,
    optional,
    Reset,
    handleProgress,
}) {
    const [data, setData] = useState([]);
    const [edited, setEdited] = useState(false);
    const [optionalInternal, setOptionalInternal] = useState(optional);
    const [reset, setReset] = useState(false);
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        if (submit === true) {
            handleDataSubmit();
        }
    }, [submit]);

    useEffect(() => {
        setReset(Reset);
    }, [Reset]);

    useEffect(() => {
        localStorage.setItem(`${type}${section}`, JSON.stringify(data));
        localStorage.setItem(`edited-${type}`, edited);
    }, [data, edited]);

    useEffect(() => {
        handleProgress(progress);
    }, [progress]);

    function handleSection(inputArray) {
        setEdited(true);
        setData({
            contentType: section,
            content: inputArray,
        });
    }

    async function handleDataSubmit() {
        if (optionalInternal === false) {
            setProgress((prev) => [...prev, "started"]);
            await replaceImage(data, type, section, name.split(" "));
            await addData(path, section, data);
            setProgress((prev) => [...prev, "finished"]);
            setTimeout(() => {
                setProgress([]);
                setReset(true);
            }, 10);
        }
    }

    return (
        <div>
            <h2>
                {type} {sectionName}
            </h2>
            {optionalInternal === false ? (
                <div>
                    <ContentForm
                        handleFormContents={handleSection}
                        isManualOfStyle={manualOfStyle}
                        section={`${type}${section}`}
                        reset={reset}
                        // test={reset}
                        edited={`edited-${type}`}
                    />
                    <br />

                    <div>
                        <button onClick={() => setOptionalInternal(true)}>
                            Remove the {sectionName.toLowerCase()}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <button onClick={() => setOptionalInternal(false)}>
                        Add {sectionName.toLowerCase()}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ContentTemplateSection;
