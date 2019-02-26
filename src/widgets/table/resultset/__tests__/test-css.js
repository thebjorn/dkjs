
import $ from 'jquery';


test("test-flex-1-css-failing-travis", () => {
    document.body.innerHTML = `
        <div id="work">
            <div id="a"></div>
        </div>
    `;
    const work = $('#work');
    console.log('$.fn.jquery:', $.fn.jquery);
    $('#a').css({flex: 1});

    console.log(work.html());

    expect(document.getElementById('work')).toMatchSnapshot();
});
