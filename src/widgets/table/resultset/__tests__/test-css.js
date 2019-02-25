
import $ from 'jquery';


test("test-flex-1-css", () => {
    document.body.innerHTML = `
        <div id="work">
            <div id="a"></div>
        </div>
    `;
    const work = $('#work');

    $('#a').css({flex: 1});

    console.log(work.html());

    expect(document.getElementById('work')).toMatchSnapshot();
});
