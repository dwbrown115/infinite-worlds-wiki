import { useEffect, useState } from "react";

import { ContentForm } from "../../components";
import { replaceImage } from "../../helpers";
import { firebase_app, addData } from "../../firebase";
function ContentTemplateSection({
    type,
    section,
    sectionName,
    name,
    path,
    submit,
    manualOfStyle,
    optional,
}) {
    const [data, setData] = useState([]);
    const [edited, setEdited] = useState(false);
    const [optionalInternal, setOptionalInternal] = useState(optional);
    const [reset, setReset] = useState(false);

    useEffect(() => {
        // console.log("data", data);
        localStorage.setItem(`${type}${section}`, JSON.stringify(data));
        // console.log()
        localStorage.setItem(`edited-${type}`, edited);
    }, [data, edited]);

    function handleSection(inputArray) {
        setEdited(true);
        setData({
            contentType: section,
            content: inputArray,
        });
    }

    async function handleDataSubmit() {
        if (optionalInternal === false) {
            await replaceImage(data, type, section, name.split(" "));
            await addData(path, section, data);
            setReset(true);
            // setData([]);
        }
    }

    useEffect(() => {
        if (submit === true) {
            handleDataSubmit();
        }
    }, [submit]);

    function handleReset() {
        // setReset(true);
        if (reset === true) {
            setReset(false);
        } else {
            setReset(true);
        }
    }

    return (
        <div>
            <h2>
                {type} {sectionName}
            </h2>
            {optionalInternal === false ? (
                <div>
                    <div>
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                    <ContentForm
                        handleFormContents={handleSection}
                        isManualOfStyle={manualOfStyle}
                        section={`${type}${section}`}
                        reset={reset}
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
                        Add {sectionName}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ContentTemplateSection;
