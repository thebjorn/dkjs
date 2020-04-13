# -*- coding: utf-8 -*-
"""
Specialized tasks.py for dkdj.8
"""
from __future__ import print_function
import os
import glob
from invoke import task, Collection
from dkfileutils.path import Path
from dktasklib import version, upversion
from dktasklib.package import Package, package


# def upload_dkdj_js(c, fname):
#     """Upload dkdj.xxx.min.js to https://static.datakortet.no/dkdj/js/jkdj.xxx.min.js
#     """
#     private_key = Path(os.environ['DKPW_SSH_KEY']).drivepath().replace('\\', '/')
#     username = os.environ['DKPW_USERNAME']
#     server = 'bischoff.datakortet.c.bitbit.net'
#     fname = os.path.basename(fname)
# 
#     # scp can only be called from 64 bit executables...
#     # https://stackoverflow.com/questions/57290518/how-do-i-enable-windows-scp-for-use-from-python
#     py64 = '''py -3-64 -c "import os;os.system(r'{cmd}')"'''
#     cmd = '{scp} -i {private_key} {src} {user}@{server}:{dst}'.format(
#         scp='scp',
#         private_key=private_key,
#         src=fname,
#         user=username,
#         server=server,
#         dst='/srv/data/static/dkdj/js/' + fname
#     )
# 
#     c.run(py64.format(cmd=cmd))

@task
def build_npm(c):
    """Build npm installable version in lib/dkdj.js
    """
    os.environ['DKBUILD_TYPE'] = 'NPM'
    c.run('webpack')


@task
def publish_prod_version(c):
    """Publish a production version of dkdj (the .js part).
    """
    fnames = glob.glob(r'dkdj\static\dkdj\js\dkdj.*.min.js')
    print("deleting old versions:", fnames)    
    if fnames:                             
        c.run('rm dkdj/static/dkdj/js/dkdj.*.min.js')

    # upversion_and_add_to_checkin
    v = upversion.upversion(c)
    c.run('git add docs/conf.py package.json setup.py src/version.js')

    # build production/web version
    os.environ['DKBUILD_TYPE'] = 'PRODUCTION'
    c.run('webpack')
    
    # git add the django include-scripts template
    c.run('git add dkdj/templates/dkdj/include-scripts.html')

    # git commit and push new version
    c.run('git commit -m "upversion"')

    # git tag and push new tagged version
    c.run('git tag -a v{v} -m "Version {v}"'.format(v=v))
    c.run('git push --tags')

    # report which files were built
    fnames = glob.glob(r'dkdj\static\dkdj\js\dkdj.*.min.js')
    print("created new version:", fnames)    
    assert len(fnames) == 1
    fname = fnames[0]        

    # [bp] collectstatic could include way too much...
    # admin = SRV / 'www' / 'admin_datakortet'
    # with admin.cd():
    #     c.run('python manage.py collectstatic --noinput')
        
    # 'manual' collectstatic
    SRV = Path(os.environ['SRV'])
    static_dkdj = SRV / 'data' / 'static' / 'dkdj' / 'js'
    # -> copy all newly created files to static-root
    c.run('cp {src} {dst}'.format(
        src=fname,
        dst=static_dkdj
    ))

    # -> add and check in all newly copied files in static-root
    with static_dkdj.cd():
        basename = os.path.basename(fname)
        c.run('svn add {}'.format(basename))
        c.run('svn ci {} -m "collectstatic"'.format(basename))

    # remember AWS...
    bfp = SRV / 'www' / 'batforerregisteret'
    with bfp.cd():
        os.environ['USE_AWS_STATIC'] = '1'
        c.run('python manage.py collectstatic --noinput')
    
    # now get local back to dev-mode..
    c.run('rm {}'.format(fname))
    del os.environ['DKBUILD_TYPE']
    del os.environ['USE_AWS_STATIC']
    c.run('webpack')
    

# individual tasks that can be run from this project
ns = Collection(
    version, upversion,
    package,
    publish_prod_version,
    build_npm,
    # collectstatic,
    # publish,
)
ns.configure({
    'pkg': Package(),
    'run': {
        'echo': True
    }
})
