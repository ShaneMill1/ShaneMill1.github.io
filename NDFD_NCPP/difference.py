import datetime
import dateutil.relativedelta

import sys

time1=int(sys.argv[1])/1000
time2=int(sys.argv[2])/1000

dt1 = datetime.datetime.fromtimestamp(time1)
dt2 = datetime.datetime.fromtimestamp(time2)
rd = dateutil.relativedelta.relativedelta (dt2, dt1)

print(str(rd.years)+" years, "+str(rd.months)+" months, "+str(rd.days)+"days, "+str(rd.hours)+" hours, "+str(rd.minutes)+" minutes and "+str(rd.seconds)+" seconds")
